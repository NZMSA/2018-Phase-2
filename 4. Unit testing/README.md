# Unit testing

This documentation will walk you through how to add unit tests to an existing solution. We will be writing tests for the API created during the bootcamp. The MSTest framework will be used in this walk through.

### Creating Test Project
Start by adding a MSTest project to the existing solution.

File -> New -> Project

![](/images/creating-unit-test-project.png)


Navigate to: MSTest Test Project (.Net Core)
Visual C# -> Web -> .Net Core

![](/images/creating-MSunit-test-project-2.png)

select "MSTest Test Project (.Net Core)". Make sure to select "Add to solution" as shown in the image above. Then click "OK" to continue.

### Setting up the test project

Start by adding a reference from the newly created test project to the API project. By right clicking on the test project solution and then: Add -> Reference...

![](/images/add_reference.png)

In the Reference Manager window select the API project as show in the image below. Then select "OK".
![](/images/adding_reference.png)

Right click on the project solution and select "Manage NuGet Packages for solution"
Add to the solution:
* Microsoft.EntityFrameworkCore
* Microsoft.EntityFrameworkCore.InMemory

### Possible Error

```
Assembly 'MemeBank' with identity 'MemeBank, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null' uses 'Microsoft.AspNetCore.Mvc.Core, Version=2.1.1.0, Culture=neutral, PublicKeyToken=adb9793829ddae60' which has a higher version than referenced assembly 'Microsoft.AspNetCore.Mvc.Core' with identity 'Microsoft.AspNetCore.Mvc.Core, Version=2.0.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60'	UnitTestMemeBank

```

If you get an error similar to the one above then do the following.
* Right click on the API project
* select "Unload"
* right click on the unloaded project and select edit \*.csproj

Ensure the following appears in the \*.csproj file

```xml
<PackageReference Include="Microsoft.AspNetCore.App" Version="2.1.2" />
```
Then reload the API project and select clean and rebuild.

## Let the Testing begin
Now we can start testing.
* Right click on the test project
* select (add -> New Item)
* create a new .cs file

Copy the following snippet to the file.

```csharp
using MemeBank.Controllers;
using MemeBank.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace UnitTestMemeBank
{
    [TestClass]
    public class PutUnitTests
    {
      // Insert your code here
    }
}
```
We will begin by defining all the class variables. Then we define what happens before a test is run and after a test is run. We want to intialise the mock database before a test runs and then we want to clear the mock database after a test runs. Making sure that all test remain independent. By mocking the database we greatly improve the speed at which the tests can run as they do not have to stand up a real database.
```csharp
public static readonly DbContextOptions<MemeBankContext> options
= new DbContextOptionsBuilder<MemeBankContext>()
.UseInMemoryDatabase(databaseName: "testDatabase")
.Options;
public static IConfiguration configuration = null;
public static readonly IList<string> memeTitles = new List<string> { "dankMeme", "dankerMeme" };

[TestInitialize]
public void SetupDb()
{
    using (var context = new MemeBankContext(options))
    {
        MemeItem memeItem1 = new MemeItem()
        {
            Title = memeTitles[0]
        };

        MemeItem memeItem2 = new MemeItem()
        {
            Title = memeTitles[1]
        };

        context.MemeItem.Add(memeItem1);
        context.MemeItem.Add(memeItem2);
        context.SaveChanges();
    }
}

[TestCleanup]
public void ClearDb()
{
    using (var context = new MemeBankContext(options))
    {
        context.MemeItem.RemoveRange(context.MemeItem);
        context.SaveChanges();
    };
}
```
Now we can begin writing the test methods to test the API. I suggest that you start by writing tests for all the CRUD methods.
```csharp
[TestMethod]
public async Task TestPutMemeItemNoContentStatusCode()
{
    using (var context = new MemeBankContext(options))
    {
        // Given
        string title = "putMeme";
        MemeItem memeItem1 = context.MemeItem.Where(x => x.Title == memeTitles[0]).Single();
        memeItem1.Title = title;

        // When
        MemeController memeController = new MemeController(context,configuration);
        IActionResult result = await memeController.PutMemeItem(memeItem1.Id, memeItem1) as IActionResult;

        // Then
        Assert.IsNotNull(result);
        Assert.IsInstanceOfType(result, typeof(NoContentResult));
    }
}
```
```csharp

[TestMethod]
public async Task TestPutMemeItemUpdate()
{
    using (var context = new MemeBankContext(options))
    {
        // Given
        string title = "putMeme";
        MemeItem memeItem1 = context.MemeItem.Where(x => x.Title == memeTitles[0]).Single();
        memeItem1.Title = title;

        // When
        MemeController memeController = new MemeController(context, configuration);
        IActionResult result = await memeController.PutMemeItem(memeItem1.Id, memeItem1) as IActionResult;

        // Then
        memeItem1 = context.MemeItem.Where(x => x.Title == title).Single();
    }
}
```
